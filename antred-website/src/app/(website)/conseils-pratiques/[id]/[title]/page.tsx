import { articles, parolesExpert } from '../../article'
import Image from 'next/image'
export default function Page({
  params
}: {
  params: { id: string; title: string }
}) {
  const article = [...articles, ...parolesExpert].find(
    (article) => article.id === params?.id
  )

  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden justify-between pt-24 px-4">
      <article>
        <div className="text-sm text-gray-500">
          <span>{article?.tag}</span>
        </div>

        <h1 className=" font-bold text-center">{article?.title}</h1>

        <div className="text-center text-gray-500 text-sm mt-2">
          <span>By {article?.author}</span> · <span>{article?.date}</span>
        </div>

        <div className="relative my-6 h-[550px]">
          <Image
            src={article?.cover?.src ?? '/images/press/default.jpeg'}
            alt={article?.cover?.alt ?? ''}
            fill
            className="w-full h-auto rounded-md object-cover fixed"
          />
        </div>

        <div className="space-y-6">
          <div
            dangerouslySetInnerHTML={{
              __html: article?.content?.firstPart ?? ''
            }}
            className="text-gray-800 leading-relaxed"
          />

          {article?.content?.quote && (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
              {article?.content?.quote}
            </blockquote>
          )}

          <div
            dangerouslySetInnerHTML={{
              __html: article?.content?.secondPart ?? ''
            }}
            className="text-gray-800 leading-relaxed"
          />

          {article?.images?.map((img, index) => (
            <div key={index} className="  my-6 w-full h-[550px] relative">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className=" w-full object-cover object-right-bottom rounded-md "
              />
            </div>
          ))}

          {article?.content?.thirdPart && (
            <div
              dangerouslySetInnerHTML={{
                __html: article?.content?.thirdPart ?? ''
              }}
              className="text-gray-800 leading-relaxed"
            />
          )}
        </div>
      </article>
    </main>
  )
}
