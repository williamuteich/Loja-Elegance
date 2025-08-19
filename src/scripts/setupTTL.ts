import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carrega variáveis de ambiente
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function setupTTLIndex() {
  const url = process.env.DATABASE_URL;
  
  if (!url) {
    console.error('❌ DATABASE_URL não encontrada');
    console.log('Certifique-se de que o arquivo .env ou .env.local existe com a variável DATABASE_URL');
    return;
  }

  const client = new MongoClient(url);

  try {
    console.log('🔗 Conectando ao MongoDB...');
    await client.connect();
    
    const db = client.db();
    
    // Listar todas as coleções para encontrar a correta
    console.log('📋 Verificando coleções existentes...');
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('Coleções encontradas:', collectionNames);
    
    // Verificar se existe coleção Cart (maiúscula ou minúscula)
    const cartCollectionName = collectionNames.find(name => 
      name.toLowerCase() === 'cart' || name === 'Cart'
    );
    
    if (!cartCollectionName) {
      console.log('⚠️ Coleção Cart não encontrada. Criando...');
      // Se não existe, vamos usar 'Cart' como padrão
      await db.collection('Cart').insertOne({
        test: true,
        expireAt: new Date(Date.now() + 1000) // Expira em 1 segundo
      });
      console.log('✅ Coleção Cart criada temporariamente');
      // Remove o documento de teste
      await db.collection('Cart').deleteOne({ test: true });
    }
    
    const finalCollectionName = cartCollectionName || 'Cart';
    console.log(`📦 Usando coleção: ${finalCollectionName}`);
    
    // Verificar índices existentes
    console.log('🔍 Verificando índices existentes...');
    const indexes = await db.collection(finalCollectionName).listIndexes().toArray();
    console.log('Índices atuais:', indexes.map(i => ({ name: i.name, key: i.key, expireAfterSeconds: i.expireAfterSeconds })));
    
    // Verificar se já existe índice TTL no campo expireAt
    const existingTTLIndex = indexes.find(index => 
      index.key && index.key.expireAt === 1
    );
    
    if (existingTTLIndex) {
      console.log(`📍 Índice existente encontrado: ${existingTTLIndex.name}`);
      console.log(`⏰ expireAfterSeconds atual: ${existingTTLIndex.expireAfterSeconds}`);
      
      // Se não tem expireAfterSeconds ou não está configurado corretamente
      if (existingTTLIndex.expireAfterSeconds === undefined) {
        console.log('❌ Índice TTL está incorreto (sem expireAfterSeconds)');
        console.log('🔄 Removendo índice incorreto...');
        await db.collection(finalCollectionName).dropIndex(existingTTLIndex.name);
        console.log('✅ Índice incorreto removido');
      } else if (existingTTLIndex.expireAfterSeconds === 0) {
        console.log('✅ Índice TTL já configurado corretamente');
        return; // Sair se já está correto
      }
    }
    
    // Criar novo índice TTL
    console.log('🆕 Criando novo índice TTL...');
    const result = await db.collection(finalCollectionName).createIndex(
      { expireAt: 1 },
      { 
        expireAfterSeconds: 0,
        name: 'cart_ttl_index'
      }
    );
    
    console.log('✅ Novo índice TTL criado:', result);
    
    // Verificar se foi criado corretamente
    const newIndexes = await db.collection(finalCollectionName).listIndexes().toArray();
    const newTTLIndex = newIndexes.find(i => i.name === 'cart_ttl_index');
    
    if (newTTLIndex) {
      console.log('🎉 Índice TTL configurado com sucesso!');
      console.log('📝 Detalhes:', {
        name: newTTLIndex.name,
        key: newTTLIndex.key,
        expireAfterSeconds: newTTLIndex.expireAfterSeconds
      });
      console.log('⚡ Os carrinhos serão automaticamente removidos quando expireAt for atingido.');
      
      // Verificar documentos que deveriam ter expirado
      const now = new Date();
      const expiredDocs = await db.collection(finalCollectionName).find({
        expireAt: { $lt: now }
      }).toArray();
      
      if (expiredDocs.length > 0) {
        console.log(`⚠️  Encontrados ${expiredDocs.length} documentos que já deveriam ter expirado`);
        console.log('🔄 O MongoDB pode levar até 60 segundos para processar a expiração após criar o índice');
      }
    } else {
      console.error('❌ Falha ao criar índice TTL');
    }
    
  } catch (error: any) {
    if (error.code === 85) {
      console.log('⚠️ Índice TTL já existe com nome diferente');
    } else {
      console.error('❌ Erro ao configurar índice TTL:', error);
    }
  } finally {
    await client.close();
    console.log('🔗 Conexão MongoDB fechada');
  }
}

// Executa apenas se o script for chamado diretamente
if (require.main === module) {
  setupTTLIndex();
}

export { setupTTLIndex };
