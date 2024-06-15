"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const { push } = useRouter()
  const pathname = usePathname()

  const handleClose = () => {
    localStorage.removeItem("token")
    push('/')
  };

  return (
    <>
      {!['/'].includes(pathname) &&
        <div className='header bg-gray-300 border-b-2 border-gray-500 w-full h-16'>
          <div className='py-2 px-4' onClick={handleClose}>
            <span className=' flex float-end bg-red-600 rounded px-2 py-2 cursor-pointer text-white hover:bg-red-400'>
              Logout
            </span>
          </div>
        </div>
      }
    </>
  )
}

export default (Navbar);