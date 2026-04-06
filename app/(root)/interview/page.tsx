import Agent from '@/components/Agent'
import React from 'react'

function page() {
  return (
    <>
        <h3>Interview Generations</h3>
        <Agent userName="You" userId="user1" type="generate"></Agent>
    </>
  )
}

export default page