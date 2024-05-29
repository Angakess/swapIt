import { Button } from "antd";

export function ButtonConfirmSwap({confirmDisabled}: {confirmDisabled: boolean}) {
    return (
        <>
            <Button type="primary" disabled={confirmDisabled} >Confirmar</Button>
        </>
    )
}