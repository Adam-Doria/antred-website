import { MissingPersonRO } from '../types/missingPerson.type'
import Image from 'next/image'

export function MissingCard(props: MissingPersonRO) {
  const imageSrc = props.images?.[0]

  return (
    <div className=" md:max-w-[25%] w-full relative overflow-hidden rounded-md shadow-xl mx-auto">
      <Image
        src={`${imageSrc}`}
        alt={`${props?.firstName} ${props?.lastName}`}
        fill
        style={{
          objectFit: 'cover'
        }}
        className=" transition-all duration-500 filter grayscale hover:filter-none "
      />

      <div className="  pointer-events-none filter-none relative z-10 flex flex-col justify-end h-96 p-4 bg-transparent">
        <div className="text-dark-foreground">
          <h3 className="font-bold w-fit rounded-lg px-2  ">
            {`${props?.firstName} ${props?.lastName}`}
          </h3>
          <p className="font-bold text-base w-fit bg-accent/55 rounded-lg px-2 my-4">
            {props?.country}
          </p>
        </div>
      </div>
    </div>
  )
}
