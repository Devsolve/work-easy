type Props = { label: string; onClick: () => void }

export default function Button({ label, onClick }: Props) {
  return (
    <button onClick={onClick} style={{ padding: 8, borderRadius: 4 }}>{label}</button>
  )
}