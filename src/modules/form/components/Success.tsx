import { CircleCheckBig } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { ProductionRegistry } from "@/entities/ProductionRegistry"

export function Success(){

  const {state} = useLocation() as {state: ProductionRegistry}
  const navigate = useNavigate()
  const [productionRegistry, setProductionRegistry] = useState<ProductionRegistry>()

  useEffect(() => {
    if(!state) navigate('/')
    setProductionRegistry(new ProductionRegistry(state))
  }, [state])

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 bg-white shadow-lg rounded-md h-full" >
      <h1 className='text-3xl font-bold w-full text-center' >Lançamento de OEE</h1>
      <h2 className="text-2xl font-bold w-full text-center">Finalizado com Sucesso!!</h2>

      <span className="text-green-700 w-full flex justify-center items-center p-8" >
        <CircleCheckBig size={100}/>
      </span>

      <div className="mt-6">
        <h3 className="text-lg font-bold">Resumo do Lançamento</h3>
        <h3 className="text-lg mb-4">{productionRegistry?.process.description}</h3>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2 bg-zinc-200">Campo</th>
              <th className="border px-4 py-2 bg-zinc-200">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Peças boas Produzidas (pçs)</td>
              <td className="border px-4 py-2">{productionRegistry?.pieces_quantity}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Tempo perdido</td>
              <td className="border px-4 py-2">{productionRegistry?.totalReasonsTime} min</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Peças refugadas</td>
              <td className="border px-4 py-2">{productionRegistry?.totalScrap}</td>
            </tr>
            {/* <tr>
              <td className="border px-4 py-2">Peças retrabalhadas</td>
              <td className="border px-4 py-2">{state?.totalRework}</td>
            </tr> */}
            <tr>
              <td className="border px-4 py-2">OEE</td>
              <td className="border px-4 py-2">{(productionRegistry?.oee! * 100).toFixed(1) + '%'}</td>
            </tr>
          </tbody>
        </table>

        <div className="w-ful flex justify-center items-center mt-4" >
          <Link to={'/'+ productionRegistry?.process.ute}>
            <button className="text-blue-500 underline text-lg" >
              Enviar novo lançamento
            </button>
          </Link>
        </div>

      </div>
    </div>
  )
}
