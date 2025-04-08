export interface MissingPerson {
  id: string
  firstName: string
  lastName: string
  birthDate?: Date | undefined | string
  gender: 'Masculin' | 'Féminin' | 'Autre'
  disappearanceDate: Date | undefined | string
  disappearanceLocation?: string
  country?: string
  coordinates: { latitude: number; longitude: number }
  description?: string
  images: string[]
  createdAt: Date | undefined | string
  updatedAt: Date | undefined | string
}

export type MissingPersonRO = Readonly<MissingPerson>
export type MissingPersonCreate = Omit<
  MissingPerson,
  'id' | 'createdAt' | 'updatedAt'
>
export type MissingPersonUpdate = Partial<MissingPersonCreate>
