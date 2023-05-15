"use client"

import { useState } from "react"

export default function Home() {
  const [users, setUsers] = useState([])
  const [displayForm, setDisplayForm] = useState({
    type: "",
    user: null,
  })
  const [formData, setFormData] = useState({})

  const handleGetAll = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    formData.id = Date.now()

    try {
      const response = await fetch("/api/users/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      setUsers(data)
      setDisplayForm({ type: "", user: null })
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      })
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`/api/users/${displayForm.user.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      setDisplayForm({ type: "", user: null })
      setUsers(data)
    } catch (error) {
      console.error(error.message)
    }
  }

  console.log(displayForm)

  return (
    <section className="relative">
      {displayForm.type && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800 p-8 shadow-lg">
          <form
            onSubmit={
              displayForm.type === "create"
                ? handleCreateUser
                : handleUpdateUser
            }
          >
            <input
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              defaultValue={
                displayForm.type === "update" ? displayForm.user.name : ""
              }
              type="text"
              placeholder="name"
              className="border bg-transparent"
            />
            <input
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              defaultValue={
                displayForm.type === "update" ? displayForm.user.age : ""
              }
              type="number"
              placeholder="age"
              className="border bg-transparent"
            />
            <div className="flex">
              <button
                onClick={() => setDisplayForm({ type: "", user: null })}
                type="button"
                className="underline mr-4"
              >
                Cancel
              </button>
              <button type="submit" className="underline">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="grid gap-4 mb-8">
        {users.map((user) => (
          <div key={user.id} className="border p-4">
            <p>{user.name}</p>
            <p>{user.age}</p>
            <button
              onClick={() => setDisplayForm({ type: "update", user })}
              className="underline mr-4"
            >
              Update User
            </button>
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="underline"
            >
              Delete User
            </button>
          </div>
        ))}
      </div>
      <div>
        <button onClick={() => handleGetAll()} className="underline block">
          Get all users
        </button>
        <button
          onClick={() => setDisplayForm({ type: "create", user: null })}
          className="underline block"
        >
          Create User
        </button>
      </div>
    </section>
  )
}
