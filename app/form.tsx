"use client"
import { redirect } from 'next/navigation'
import { FormEvent } from 'react'

export default function Form() {

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const jsonData: { [key: string]: FormDataEntryValue | FormDataEntryValue[] } = {};
        const formData = new FormData(event.currentTarget)

        formData.forEach((value, key) => {
            // Use 'any' to bypass the type checking on the index, alternatively define a more complex type
            const existing = jsonData[key];
            if (existing !== undefined) { // Check if the key exists
                // If the key exists and it's not an array, convert it to an array
                if (!Array.isArray(existing)) {
                    jsonData[key] = [existing]; // Cast existing as a single FormDataEntryValue item array
                }
                (jsonData[key] as FormDataEntryValue[]).push(value); // Now we can safely push the new value
            } else {
                jsonData[key] = value; // Set the new value as it is
            }
        })

        await fetch('/api', {
            method: 'POST',
            body: JSON.stringify(jsonData),
        }).then(function (response) {
            return response.json()
        }).then(
            function (data) {
                console.log(data.id)
                redirect(data.id)
            }
        )

    }

    return (
        <form className="flex-col items-center justify-between p-24" onSubmit={onSubmit}>
            <div className="flex flex-col items-center justify-between p-24" >
                <label className="text-2xl font-bold">Headline</label>
                <input className="border-2 border-gray-500 rounded-md text-black" name="headline" type="text" />
            </div >
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send</button>
        </form >
    )
}