import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

async function getTurnData(id:string|undefined){
  const endpoint = `http://localhost:8000/turns/detail/${id}/`
  return fetch(endpoint)
  .then(res => res.json())
  .then(data => data)
  .catch(err => console.log("[GET TURN DATA][ERROR]", {err}))
} 

export function Rating() {
  const { rol, id } = useParams()
  const [data, setData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  

  const getOwner = (data:any, rol:string) => {
    // Si el enlace es del usuario que recibió la oferta entonces hago que el user maker de la calificación sea el user del post_receive.
    if(rol === 'R') return {user_maker: data.post_receive.user, user_received: data.post_maker.user}
    return {user_maker: data.post_maker.user, user_received: data.post_receive.user}
  }

  const handleChange = (e:any) => {
    const {name, value} = e.target
    setData({
      ...data,
      [name]: value
    })
  }

  const handleSubmit = () => {
    (async ()=> {
      console.log("[HANDLE SUBMIT]", {data})
      setLoading(true)
      const body = {
        score: data.score,
        comment: data.comment,
        user_maker: data.user_maker.id,
        user_received: data.user_received.id
      }
      console.log("[HANDLE SUBMIT][BODY]", {body})
      fetch(`http://localhost:8000/ratings/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      .then(res => res.json())
      .then(data => console.log("[HANDLE SUBMIT][SUCCESS]", {data}))
      .catch(err => console.log("[HANDLE SUBMIT][ERROR]", {err}))
      .finally(() => setLoading(false)) 
    })();
  
  }

  useEffect(() => {
    console.log("[USE EFFECT][START]", {rol, id})
    getTurnData(id)
    .then(data => {
      console.log("[USE EFFECT][DATA]", {data})
      setData({
        ...getOwner(data, rol as string),
        score:0,
        comment: "",
        day:data.day_of_turn,

      })
      setLoading(false)
    })
    .catch(err => console.log("[USE EFFECT][ERROR]", {err}))
  }, [])


  return ((loading && <div>Cargando...</div>  )||
    <main>
      <section>
        {
          data && (
            <>
            <h2><strong>Calificar al usuario:  {data.user_received.first_name + " "+data.user_received.last_name}</strong></h2>
            <small><strong>Fecha del trueque: {data.day}</strong></small>
            <form onSubmit={handleSubmit}>
              <label htmlFor="score">Calificación</label>
              <input 
              onChange={handleChange}
              value={data.score}
              type="number" id="score" name="score" min="0" max="5" />
              <label htmlFor="comment">Comentario</label>
              <textarea id="comment" name="comment"
                value={data.comment}
                onChange={handleChange}
              />
              <button type="submit">Calificar</button>
            </form>
            </>
          )
        }
      </section>
    </main>
  )
}