import React from 'react'
import { RootLayout } from '@payloadcms/next/layouts'
import { handleServerFunctions } from '@payloadcms/next/layouts'
import type { ServerFunctionClient } from 'payload'
import config from '@payload-config'
import { importMap } from './importMap'
import '@payloadcms/next/css'

// Server Action — wraps handleServerFunctions with the config and importMap
// so that client components can call server functions without knowing about them.
const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}
