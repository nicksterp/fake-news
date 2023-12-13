import Image from 'next/image'
import Form from '../components/form'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className='flex flex-col items-center max-w-md justify-start'>
        <h1 className="text-3xl">Generate some fake news!</h1>
        <p>This app uses ChatGPT, so there will be moderation for certain prompts/headlines, and even if the article generates, the images may not. Sorry!</p>
        <p>Additionally, images may not be fully uploaded when you are redirected to your article, so try refreshing after a few seconds.</p>

        <Form />
      </div>
    </main >
  )
}
