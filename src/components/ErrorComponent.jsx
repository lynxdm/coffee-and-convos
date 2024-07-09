import React from 'react'

function ErrorComponent() {
  return (
    <main className='grid place-items-center h-[90vh] px-6'>
        <div className='text-center flex flex-col gap-10'>
            <h1 className=' text-2xl lg:text-4xl font-semibold'>There was a problem loading the page...</h1>
            <button className='bg-primary dark:bg-darkPrimary dark:text-primary text-white w-fit mx-auto px-10 py-3 rounded-3xl font-semibold' onClick={()=>{
                window.location.reload()
            }}>Try again</button>
        </div>
    </main>
  )
}

export default ErrorComponent