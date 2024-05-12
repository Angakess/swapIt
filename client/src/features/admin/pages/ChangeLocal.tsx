export function ChangeLocal(){

    const parts = window.location.href.split("/")
    const index: number = parseInt(parts[parts.length - 1])

    return (
        <>
            <p>Cambiando el local del ayudante {index}</p>
        </>
    )
}