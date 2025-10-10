export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Teste de Roteamento</h1>
      <p>Se você está vendo esta página, o roteamento está funcionando.</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  )
}
