import React from 'react'

const Loading = ({isLoading, selectedConvo}) => {
  return (
    <div className="flex-1">
    <div className="flex flex-grow h-full  items-center justify-center font-extralight text-2xl">
      {!selectedConvo && "No convo selected to type!"}
      {isLoading && (
        <span className="animate-spin h-3 w-3 mr-5 ">{".."}</span>
      )}
    </div>
  </div>
  )
}

export default Loading