"use client"
import { FormEvent } from 'react'
import { useState } from 'react'
import { useRouter } from "next/navigation";
export default function Form() {

    const [loading, setLoading] = useState(false)
    const router = useRouter();
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setLoading(true)

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

        const id = await fetch('/api', {
            method: 'POST',
            body: JSON.stringify(jsonData),
        }).then(function (response) {
            return response.json()
        }).then(
            function (data) {
                return (data.id)
            }
        )

        router.push('/' + id);
    }

    return (
        <form className="flex flex-col items-center justify-between p-5" onSubmit={onSubmit}>
            <div className="flex flex-col items-center justify-between p-5" >
                <label className="text-2xl font-bold">Headline</label>
                <input disabled={loading} className="border-2 border-gray-500 rounded-md text-black w-[50vh]" name="headline" type="text" />
            </div >
            <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send</button>
            {/* if Loading true, show loading spinner */}
            {loading && <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
            </div>}
        </form >
    )
}