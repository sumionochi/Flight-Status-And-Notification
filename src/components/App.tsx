import React from 'react'
import SearchPage from './SearchPage'
import Nav from './Nav'

type Props = {}

const App = (props: Props) => {
  return (
    <>
      <Nav/>
      <div className='pt-16'></div>
      <div className='p-4'>
      <SearchPage/>
      </div>
    </>
  )
}

export default App