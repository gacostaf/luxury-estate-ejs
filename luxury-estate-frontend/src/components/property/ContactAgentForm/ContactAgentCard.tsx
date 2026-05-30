import type { AssociateCardDTO } from '@/types/associate'

interface Props {
  associate: AssociateCardDTO
}

export function ContactAgentCard({
  associate,
}: Props) {

  return (
    <div className="rounded-[32px] bg-slate-900 p-10 text-white">

      <img
        src={
          associate.profileImageUrl
        }
        alt={
          associate.fullName
        }
        className="h-32 w-32 rounded-full object-cover"
      />

      <h3 className="mt-6 text-3xl font-bold">
        {associate.fullName}
      </h3>

      <p className="mt-2 text-slate-300">
        {associate.title}
      </p>

      <div className="mt-8 space-y-4">

        <div>
          {associate.email}
        </div>

        <div>
          {associate.phone}
        </div>

      </div>

    </div>
  )
}
