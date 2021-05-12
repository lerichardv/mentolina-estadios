import React from 'react'
import Head from 'next/head'

export default function Share() {
   return (
      <>
         <Head>
            <meta property="og:url" content="https://micasamiestadio.com/share" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Your Website Title" />
            <meta property="og:description" content="Your description" />
            <meta property="og:image" content="https://dummyimage.com/vga" />
         </Head>
      </>
   )
}
