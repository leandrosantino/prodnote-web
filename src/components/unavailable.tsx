
export function Unavailable(){
  return (
    <div className="w-full h-full flex justify-center items-center flex-col" >
      <h1 className="font-bold text-blue-500 text-2xl" >Em manutenção!</h1>
      <p className="text-center" >
        O sistema está passando por modificações no momento. <br />
        Em algums minutos ele estará de volta.
      </p>
    </div>
  )
}
