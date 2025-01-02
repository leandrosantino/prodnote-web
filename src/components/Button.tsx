
type ButtonProps = {
  text: string
  color: 'blue' | 'green'
  type: 'button' | 'submit'
  onClick?: () => void
  loading?: boolean
}

export function Button({ text, color, loading, ...rest}: ButtonProps){

  return (
    <button
      {...rest}
      className={"p-2 text-white rounded-md w-full font-medium flex items-center justify-center gap-2 " + (color == 'blue'?'bg-blue-500':'bg-green-500')}
    >
      {loading && <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" ></div>}
      {!loading &&text}
    </button>
  )
}
