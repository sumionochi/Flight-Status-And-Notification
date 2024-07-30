import { Plane } from 'lucide-react'
import React from 'react'

type Props = {}

const Nav = (props: Props) => {
  return (
    <nav className='bg-blue-900 fixed w-full items-center flex flex-row p-4 gap-1'>
        <p className='font-semibold text-white text-2xl'>Indigo</p>
        <Plane className='text-white w-6 h-6'/>
    </nav>
  )
}

export default Nav