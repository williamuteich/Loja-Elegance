"use client";

import React from "react";

export default function CheckoutSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-hidden>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <form className="space-y-5 w-full mx-auto">
            <div className="text-start">
              <div className="h-9 w-56 rounded-md bg-gray-200 animate-pulse" />
              <div className="mt-2 h-4 w-80 rounded bg-gray-200 animate-pulse" />
            </div>

            <div className="space-y-4 mt-4">
              <div className="rounded-xl border border-gray-200 bg-transparent">
                <div className="flex items-start py-10 px-4 gap-4">
                  <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />

                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-40 rounded-md bg-gray-200 animate-pulse" />
                    <div className="h-4 w-64 rounded-md bg-gray-200 animate-pulse" />
                  </div>
                </div>

                <div className="border-t border-gray-100 px-5 py-3 bg-gray-50/30">
                  <div className="h-4 w-52 rounded bg-gray-200 animate-pulse" />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-transparent">
                <div className="flex items-start py-10 px-4 gap-4">
                  <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />

                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-44 rounded-md bg-gray-200 animate-pulse" />
                    <div className="h-4 w-52 rounded-md bg-gray-200 animate-pulse" />
                    <div className="h-3 w-36 rounded-md mt-1 bg-gray-200 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-end">
              <div className="inline-block h-12 w-36 rounded-xl bg-gray-200 animate-pulse" />
            </div>
          </form>
        </div>

        <div className="lg:w-80 lg:flex-shrink-0">
          <div className="sticky top-6 rounded-2xl overflow-hidden border bg-gradient-to-r from-pink-50 to-purple-50/30 p-0">
            <div className="p-4 border-b">
              <div className="h-6 w-44 rounded-md bg-gray-200 animate-pulse" />
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {[0, 1].map((i) => (
                  <div key={i} className="flex gap-4 p-3 rounded-lg">
                    <div className="w-16 h-16 rounded-lg flex-shrink-0 bg-gray-200 animate-pulse" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-4 w-40 rounded-md bg-gray-200 animate-pulse" />
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-200 animate-bounce" />
                        <div className="h-3 w-24 rounded-md bg-gray-200 animate-pulse" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-6 w-20 rounded-md bg-gray-200 animate-pulse" />
                        <div className="h-5 w-24 rounded-md bg-gray-200 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-40 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-4 w-24 rounded-md bg-gray-200 animate-pulse" />
                </div>

          
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-28 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-6 w-32 rounded-md bg-gray-200 animate-pulse" />
                </div>
              </div>

              <div className="mt-3">
                <div className="h-12 w-full rounded-xl bg-gray-200 animate-pulse" />
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mt-4 border border-pink-100">
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 rounded-md bg-gray-200 animate-pulse" />
                  <div className="h-4 w-44 rounded-md bg-gray-200 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
