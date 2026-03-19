import Canva from "@/components/canva"
import LoginHandler from "@/components/loginHandler"

export default function Login(): React.JSX.Element {
  return (
    <>
      <Canva className="fixed inset-0 z-10"/>
      <LoginHandler />
    </>
  )
}