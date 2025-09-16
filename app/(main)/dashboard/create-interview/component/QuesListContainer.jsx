import React from 'react'

const QuesListContainer = ({questionlist}) => {
  return (
    <div>
        <h3 className='text-lg font-semibold mb-4'>Generated Questions:</h3>
          <div className='space-y-3'>
            {questionlist.map((question, index) => (
              <div key={index} className='p-4 bg-white rounded-lg border'>
                <div className='flex items-start gap-3'>
                  <span className='w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium'>
                    {index + 1}
                  </span>
                  <div>
                    <span className='inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mb-2'>
                      {question.type}
                    </span>
                    <p className='text-gray-900'>{question.question}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
    </div>
  )
}

export default QuesListContainer