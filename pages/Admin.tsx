import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

export const Admin: React.FC = () => {
  const { organizers, createOrganizer } = useData();

  const [organizerName, setOrganizerName] = useState('');
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [organizerPassword, setOrganizerPassword] = useState('');
  const [organizerCode, setOrganizerCode] = useState('');
  
  const [orgMessage, setOrgMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleCreateOrganizer = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createOrganizer(organizerName, organizerEmail, organizerPassword, organizerCode);
    setOrgMessage({ type: result.success ? 'success' : 'error', text: result.message });
    if(result.success) {
        setOrganizerName('');
        setOrganizerEmail('');
        setOrganizerPassword('');
        setOrganizerCode('');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center mb-2">Painel de Administração</h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Gerencie os organizadores do sistema.</p>
      
       <div className="text-center mb-8 space-x-6">
            <Link to="/login" className="text-light-primary dark:text-dark-primary hover:underline">
                Ir para Login do Organizador &rarr;
            </Link>
             <Link to="/participar" className="text-green-500 hover:underline">
                Ir para Inscrição de Participante &rarr;
            </Link>
        </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Organizer */}
        <div className="lg:col-span-2 bg-light-card dark:bg-dark-card p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Cadastrar Novo Organizador</h2>
          <form onSubmit={handleCreateOrganizer} className="space-y-4">
            <input type="text" value={organizerName} onChange={e => setOrganizerName(e.target.value)} placeholder="Nome do Organizador" required className="w-full input-style" />
            <input type="email" value={organizerEmail} onChange={e => setOrganizerEmail(e.target.value)} placeholder="E-mail de Login" required className="w-full input-style" />
            <input type="password" value={organizerPassword} onChange={e => setOrganizerPassword(e.target.value)} placeholder="Senha" required className="w-full input-style" />
            <input type="text" value={organizerCode} onChange={e => setOrganizerCode(e.target.value.toUpperCase())} placeholder="Código Exclusivo (ex: TRIAD3)" required className="w-full input-style" />
            <button type="submit" className="w-full btn-primary">Criar Organizador</button>
            {orgMessage && <p className={`mt-2 text-sm text-center ${orgMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{orgMessage.text}</p>}
          </form>
        </div>
      </div>

      <div className="mt-12 bg-light-card dark:bg-dark-card p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Organizadores Cadastrados</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b border-light-border dark:border-dark-border">
                        <th className="px-4 py-2 text-left">Organizador</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Código</th>
                    </tr>
                </thead>
                <tbody>
                    {organizers.map(org => (
                        <tr key={org.id} className="border-b border-light-border dark:border-dark-border last:border-b-0">
                            <td className="px-4 py-2">{org.name}</td>
                            <td className="px-4 py-2">{org.email}</td>
                            <td className="px-4 py-2 font-mono text-cyan-400">{org.organizerCode}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

// Helper styles for inputs and buttons for this page
const styles = `
.input-style {
    display: block;
    width: 100%;
    padding: 0.75rem;
    background-color: #1a1a1a; /* dark:card */
    border: 1px solid #2d2d2d; /* dark:border */
    border-radius: 0.375rem;
    box-shadow: sm;
    color: #E0E0E0; /* dark:text */
}
.btn-primary {
    padding: 0.75rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    color: white;
    background-image: linear-gradient(to right, #00D1FF, #0052FF);
    transition: opacity 0.2s;
}
.btn-primary:hover {
    opacity: 0.9;
}
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);