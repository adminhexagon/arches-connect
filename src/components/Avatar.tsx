import { avatarColor, initials } from '../data/network'

export function Avatar({ name, id }: { name: string; id: string }) {
  return (
    <span className="avatar" style={{ background: avatarColor(id) }} aria-hidden="true">
      {initials(name)}
    </span>
  )
}
