import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '../context/DataContext';
import { Raffle, Event } from '../types';
import { Link, useSearchParams } from 'react-router-dom';

const Triad3Logo = () => (
    <img 
        src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAE+AT4DASIAAhEBAxEB/8QAGwABAQACAwEAAAAAAAAAAAAAAAECBAMFBgf/xAAzEAABAgQDBgQGAgMBAAAAAAABAAIDBBEhBRIxQVFhcRMigZEGFLHB0UJSYqHwIzNi4f/EABgBAQEBAQEAAAAAAAAAAAAAAAABAgME/8QAHBEBAQEBAQEAAwEAAAAAAAAAAAERAhIhMQNBIv/aAAAAMhAD8A/SA4mwAklVw+LCfM6V41JzWj1Sj6r8r0i7hMGL4R7hG7IqXz4U/2x2qXo/JMR4kM2s+f21T8bA95C14SDA/hN25tN/d+FzN/u+h0h4yHHh/iO+o/R/J4sJj9sdq/U/Y8XgweK6H9z7UuM/K4nAhO+M/qfKz/d/K4sLh/wnj1PyuJ/S4eFC/hvHqfk9B/C4MGI2M/qfssXhQ34bz6/deM/P/p8OHAf8AEePU/deP/P/AKXDhcP9h49T8q+JwmBC74fHqflZ/ufy8WFw/wC28ep+VxP6XDhQobGfwuJ/S/g+FC74fHqfk/P/AK8Xgwu+H/AHH2/K4n9LhwoX8N/wB/ZeP/AD/6XDgQn/EePU/Zf8j/AEXFhMP+28f7XzZ/ufyuPCg/wvHqflcT+lw4UJuxn8Lif0uHChdzP4XE/pcCFC7mfwuJ/P8A68Xgwv4b/wC/svH/AJ/9PhwID/iPHqfsvH/n/wBLhwuF+w8ep+VfE4MKE3w/6n7K+J/P/rxeDC/hv/v7Lif0uHChdzP4XzP6XA/peFC7mfwuJ/P/AK8XgQv4b/7+y4n9PhwYT/iPHqfsv+R/ouLCg/wvHqfsv+R/p/0uJwmFD7n8rif0uHChd8P+o+35XE/p8OHCf8R49T9l/yP9FxYTDj4j/qft/K4n9LgQoTdjP6n7Lifz/6vF4MLvh/3H2XE/n/ANeLwYXfD/uPt+Vxf6XDhwobGf1P2XE/pcOFC7mfwuJ/S4MKF3M/hfM/p8CE/wC48ep+y4n8/wDrweDC/hv/AL+y8f8An/0uDCgN+I8ep+y4n8/+vF4EL+G/+4+y8f8An/0uJwmHD7n+p+35XF/pcCHC7mfwuJ/P/rxeBC74b/7j7Lif0+DC/hPHqfss/wB38riwmF+w8f7X/I/0uJCYb4zx6n7Lif0uHDhP+I8ep+y4n9Lhw4T/AIjx6n7L/kf6XDhsL9h4/wB//aYkZsd/U/aJ82K34rvqft8z/L/pcSHCf8R/wBT9rif0uJChN+M/wC/ss/3fy4sLh/8Pj1P2X/I/wBLgwIT/uPHqfsv+R/pcGEw/wC28ep+V/yP9LhQu+M8ep+Vn+7+VxoUP8Lz/t/K4n9LhQ4X8J/1P2V8T+nw4cKE3w/+o+y4n9PhwoTdjP6n7LifyvF4ML+G/wDv7Lif0uBAhd8P+o+y4n8/+vF4ELvhv/uPt+VxP5/9eLwYTfD/ALj7Lif0+DCH/EePU/Zf8j/S4cJg/wDD49T8rif0uHCf8R49T8rif0uHDhP+I8ep+3E/n/1eDAhN8P8AqPtuf+f/AF4vBhd8P+o+y4n8/wDrxeDC74f9x9lxP5/9eLwYTfD/ALj7Dif0+HCg/wCI8ep+y/5H+lwmFA/hPHqftuf+X8riwmE3Yzx/tL/kf6XEhw4b4zx/t/K4n8+vF4cLvh/1H2XE/pcCHC7mfwuJ/P8A68Xgwv4b/wC/svG/n/0uHCgN+I8ep+yvify8XgQv4Tz6n7Lif0+HChP+I/6j7Lifz/6vBhd8P+4+y4n8/wDrxeBC74f9R9lxP5/9eLwITfD/ALj7Lif0+DChN+I8ep+y4v8APrwYTDfGePU/Zf8AI/0uHDYf7Dx/tf8AI/0uFC74zx/tL/kf6XChP+48ep+y4n8/+rxYELvhv/v7LifyvF4EL+G/+4+y4n8/+rxYELvhv/uPstxP5/8AXi8GE3w/7j7Lif0+DChP+I8ep+y/5H+lw4TDfGePU/Zbify8XhwmF+w8ep+yvifyvF4cKE3w+PU/Zf8AI/0uEw4TdjeP9rif0uBChdzP4XE/n/1eLwYTfD/uPsuJ/P8A68Xgwv4b/wC4+y4n8/+vF4MLvhv/ALj7Lifz/wCvF4MLvhv/ALj7Lif0+DCg/wCI8ep+y/5H+lwmF+w8ep+y4n8+vF4cKE3Yzx6n7L/kf6XDhsP9h4/2uJ/P/q8OBC7mfwuJ/P8A68Xgwv4b/wC/suJ/P/rxYELvhv8A7j7Lifz/AOvF4MLvhv8A7j7Dif0+DChP+I8ep+y4v8+vBhsN8Z49T9rify8XhwmHD7Dx6n7Lifz68XhQv4Tz6n7Dif0uBAhd8P+p+y4n8rxeBC/hv/v7LifyvF4MLvhv/v7Dif0uBC7mfwuJ/LxeBC74f9R9lxP5/9XgwobfD/qPsuJ/P/rxYMLvh/wB/ZcT+nwYUJvxHj1P2X/I/0uGw/wBh4/2uJ/PrxeHC7mfwuJ/PrweBC7mfwuJ/PrxeDC7mfwuJ/LweBC7mfwuJ/LweFC7mfwuJ/PrxeBC7mfwuJ/Pry/i/m/8Ab8fG4f5v/D4+Nwvzf+H/AHf/xAArEAABBAECBQUBAQEBAAAAAAAAAQIDERIEExAhMSJBUSIwYQUyQkBxFEL/2gAIAQEAAT8B+J5xU076sJkZ31G40x0+5c5vO/N//K+m2PzZ00j8d9aI3O+u3GZ31f6/H//AL9l9NsfmzppH4760Rsd9duMzvq/1+P/AP37L6bY/NnTSRx31ojY767cZnfV/r8f/wDv2X02x+bOmkjjvrRGx3124zO+r/X4/wD/AH7L6bY/NnTSPx31ojc767cZnfV/r8f/APv2X02x+bOmkfjjvrRG53124zO+r/X4/wD/AH7L6bY/NnTSPx31oic767cZnfV/r8f/APv2X02x+bOmkcjvqkI0jN6/E8m7k37tG70i8h7l6d3d9O/NqV3I5I5fK739h6d+P/8Ap9VsfmzppI46+h4aRmd/ieT93N0zR/j0i8h7l6d3d9O/NqV3I5I5fK739h6d+P/8Ap9VsfmzppI46+h4aRmd/ieTd3Jum/do/XpF5D3L07u76d+bUruRyRy+V3v7D078f/6fVbH5s6aSOOvoeGkZnf4nk/dydN+7R+vSLyHuXp3d30782pXcjkeRy+V3v7D078f/ACn1Wx+bOmkjg+h4aRmd/ieTd3Jum/do/XpF5D3L07u76d+bUruRyRy+V3v7D078f/AOn1Wx+bOmkjh9Dw8/M7/E8n7uTpu/bo3ekXkPcvTu7vp35tSu5HI8jl8rvf2Hp34/8A9Pqtj82dNJHF9Dw8/M7/ABPJ+7k3b9u/ekXkPcvTu7vp35tSu5HI8jl8rvf2Hp34/wD+n1Wx+bOmkjz/AE/8T/jP+M/5/sP+M/5XzP8AgfQ7H5/8/T/9R//xAAvEAABAwICCAgDAAAAAAAAAAAAAQIDEQQSExAgMSFAURQiMEFSYWJygaFxsiP/2gAIAQIBAT8B8t9/67f/AFXf+t9L81+W28rS8j8/67f/AFXf+t9L81+W28rS8j8/67f/AFXf+t9L81+W28rS8j8/67f/AFXf+t9L81+W28rS8j8/67f/AFXf+t9L81+W28rS8j8/67f/AFXf+t9L81+W28rS8j8/67f/AFXf+t9L81+W28rS8j8570Tqv38T60670v6z2V3e7v5Glele9K/f9Pwv6r5e8i+h21rO6iO6+J9adV+l/XfL6rR+i+/9dv/AKrv/W+l+a/LbeVpeR+c96J1X7+J9adV6X9Z7K7vd38jSvSvelft+n4X9V8veRfQ7a1ndRHdfE+tOq/S/rvl9Vo/Rff+u3/1Xf8ArfS/NfltvK0vI/Oe9E6r9/E+tOq/S/rPZXd7u/kaV6V70r9v0/C/qvl7yL6HbWs7qI7r4n1p1X6X9d8vqtH6L7/12/8Aqu/9b6X5r8tt5Wl5H5z3onVfv4n1p1XpX1nsru93fyNK9K96V+36fhf1Xy95F9DtrWd1Ed18T606r9L+u+X1Wj9F9/67f/AFXf+t9L81+W28rS8j8570Tqv38T606r0r6z2V3e7v5Glele9K/b9Pwv6r5e8i+h21rO6iO6+J9adV+l/XfL6rR+i+/9dv/qu/wDW+l+a/LbeVpeR+c96J1X7+J9a9l+t/Weyu73d/I0r0r3pX7fp+F/VfL3kX0O2tZ3UR3XxPrXqvS/rvl9Vo/Rff+u3/wBV3/rfS/NfltvK0vI/Oe9E6r9/E+teq/S/rPZXd7u/kaV6V70r9v0/C/qvl7yL6HbWs7qI7r4n1r2X6X9d8vqtH6L7/wBdv/qu/wDW+l+a/LbeVpeR+d0u6f0u6/S/pf8Ak6pdUuqXVd13X/f9p/8Ak6L8n9Luv8nS/rf0v/8QAMRAAIBAQIFDAUFAAAAAAAAAAAAAQIDEQQQEiExBSJBYXETIDAzkUBCUoGhwWKhseH/2gAIAQMBAT8B9+i+C/u834P7u4u5yH6L4L+7zfg/u7i7nIforgv7vN+D+7uLuciforgr+7zfg/u7i7nIfovgv7vN+D+7uLuciforgr+7zfg/u7i7nIfovgv7vN+D+7uLucif3k+uXGf6nFjK5yT6Y/U3u7u7q9xZk+pyX8L7nK/zC4LhZ+mU5c3/X6o/6nFjK6J9Md7u7uLucif3k+uXGf6nFjK5yT6Y/U3u7u7q9xZk+pyX8L7nK/zC4LhZ+mU5c3/AF+qP+pxYyuidMd7u7uLucif3k+uXGf6nFjK5yT6Y/U3u7u7q9xZk+pyX8L7nK/zC4LhZ+mU5c3/X6o/wCpzYiuidMd7u7uLucif3k+uXGf6nFjK5yT6Y/U3u7u7q9xZk+pyX8L7nK/zC4LhZ+mU5c3/X6o/6nNiK6J0x3u7uLucif3k+uXGf6nFjK5yT6Y/U3u7u7q9xZk+pyX8L7nK/zC4LhZ+mU5c3/AF+qP+pzYiuidMd7u7uLucif3k+uXGf6nFjK6J0/Vvd3d3V7izJ9Tkv4X3OV/mFwXCz9Mpy5v+v1R/1ObEV0Tpn0N7u7uLucif3k+uXGf6nFjK5yT6/Vvd3d3V7izJ9Tkv4X3OV/mFwXCz9Mpy5v+v1R/wBObEV0Tpn0N7u7uLucif3c3JzeU5cpzc+pPk+pyfUnNyfLlLly5cuXI//2Q==" 
        alt="Triad3 Logo" 
        className="w-48 mx-auto mb-6"
    />
);

export const Participar: React.FC = () => {
    const [step, setStep] = useState<'enterCode' | 'register' | 'success'>('enterCode');
    const [raffleCode, setRaffleCode] = useState('');
    const [foundRaffle, setFoundRaffle] = useState<(Raffle & { event: Event }) | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const { addParticipant } = useData();
    const [searchParams] = useSearchParams();

    const findRaffleRemotely = useCallback(async (code: string) => {
        if (!code) {
            setMessage({ type: 'error', text: 'O código não pode estar vazio.' });
            return;
        }
        setLoading(true);
        setMessage(null);
        try {
            const response = await fetch('https://webhook.triad3.io/webhook/getsorteios-triad3');
            if (!response.ok) {
                throw new Error('Falha ao buscar a lista de sorteios. Verifique sua conexão.');
            }
            const rafflesData: any[] = await response.json();
            
            const matchingRaffleData = rafflesData.find(r => r['Código do sorteio']?.toUpperCase() === code.toUpperCase());
            
            if (matchingRaffleData) {
                const mappedRaffle: Raffle & { event: Event } = {
                    id: String(matchingRaffleData.Id),
                    name: matchingRaffleData['Objeto do sorteio'],
                    quantity: parseInt(matchingRaffleData['Quantidade de objetos'], 10) || 1,
                    code: matchingRaffleData['Código do sorteio'],
                    eventId: `evt_${matchingRaffleData.Id}`,
                    event: {
                        id: `evt_${matchingRaffleData.Id}`,
                        name: matchingRaffleData['Nome do evento'],
                        organizerId: `org_${matchingRaffleData['Código da empresa'] || 'external'}`,
                        code: 'EVTCODE_EXTERNAL'
                    }
                };
                setFoundRaffle(mappedRaffle);
                setStep('register');
            } else {
                setMessage({ type: 'error', text: 'Código do sorteio não encontrado. Verifique e tente novamente.' });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Ocorreu um erro ao buscar o sorteio. Tente novamente mais tarde.' });
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCodeSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        await findRaffleRemotely(raffleCode);
    };
    
    useEffect(() => {
        const codeFromUrl = searchParams.get('code');
        if (codeFromUrl) {
            setRaffleCode(codeFromUrl.toUpperCase());
            findRaffleRemotely(codeFromUrl);
        }
    }, [searchParams, findRaffleRemotely]);

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone || !email || !foundRaffle) {
            setMessage({ type: 'error', text: 'Por favor, preencha todos os campos.' });
            return;
        }
        setLoading(true);
        setMessage(null);
        const result = await addParticipant({ name, phone, email, raffleId: foundRaffle.id });
        setLoading(false);

        if(result.success) {
            setMessage({ type: 'success', text: result.message + ' Boa sorte!' });
            setStep('success');
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    };

    const resetFlow = () => {
        setStep('enterCode');
        setRaffleCode('');
        setFoundRaffle(null);
        setMessage(null);
        setName('');
        setPhone('');
        setEmail('');
    };

    const renderContent = () => {
        switch (step) {
            case 'enterCode':
                return (
                    <>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary mb-2">Participar de Sorteio</h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Insira o código do sorteio para se cadastrar.</p>
                        <form onSubmit={handleCodeSubmit} className="space-y-6 text-left">
                            <div>
                                <label htmlFor="raffle-code" className="block text-sm font-medium text-light-text dark:text-dark-text">Código do Sorteio</label>
                                <input
                                    type="text"
                                    id="raffle-code"
                                    value={raffleCode}
                                    onChange={e => setRaffleCode(e.target.value.toUpperCase())}
                                    placeholder="EX: TCNFTECH4K"
                                    required
                                    className="mt-1 block w-full px-3 py-2 bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-light-primary focus:border-light-primary dark:focus:ring-dark-primary dark:focus:border-dark-primary sm:text-sm"
                                />
                            </div>
                            <button type="submit" disabled={loading} className="w-full btn-primary">
                                {loading ? 'Buscando...' : 'Encontrar Sorteio'}
                            </button>
                        </form>
                    </>
                );
            case 'register':
                 if (!foundRaffle) return null;
                 return (
                    <>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary mb-2">Inscrição para <span className="text-yellow-400">{foundRaffle.name}</span></h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">Evento: <span className="font-semibold text-dark-text">{foundRaffle.event.name}</span></p>
                         <form onSubmit={handleRegisterSubmit} className="space-y-6 text-left">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium">Nome</label>
                                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full input-style" />
                            </div>
                             <div>
                                <label htmlFor="phone" className="block text-sm font-medium">Telefone</label>
                                <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="mt-1 w-full input-style" />
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium">E-mail</label>
                                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full input-style" />
                            </div>
                            <button type="submit" disabled={loading} className="w-full btn-primary">
                                {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                            </button>
                         </form>
                    </>
                 );
            case 'success':
                return (
                    <div className="text-center">
                         <h1 className="text-3xl font-bold text-green-400 mb-2">Sucesso!</h1>
                         <p className="text-gray-300 mb-6">{message?.text}</p>
                         <button onClick={resetFlow} className="w-full btn-secondary">
                            Cadastrar em outro sorteio
                         </button>
                    </div>
                );
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-light-background dark:bg-dark-background px-4">
          <div className="w-full max-w-md">
            <div className="bg-light-card dark:bg-dark-card p-8 rounded-lg shadow-xl text-center">
                <Triad3Logo />
                {renderContent()}
                {message && step !== 'success' && (
                  <div className={`mt-4 p-3 rounded-md text-center text-sm ${message.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                    {message.text}
                  </div>
                )}
            </div>
             <div className="text-center mt-4">
                <Link to="/login" className="text-sm text-light-primary dark:text-dark-primary hover:underline">
                    É um organizador? Faça Login &rarr;
                </Link>
            </div>
          </div>
          <style>{`
            .input-style {
                display: block; width: 100%; padding: 0.75rem; background-color: #111111;
                border: 1px solid #2d2d2d; border-radius: 0.375rem; color: #E0E0E0;
            }
            .btn-primary {
                padding: 0.75rem 1rem; border-radius: 0.375rem; font-weight: 600; color: white;
                background-image: linear-gradient(to right, #00D1FF, #0052FF);
                transition: opacity 0.2s;
            }
            .btn-primary:hover { opacity: 0.9; }
            .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
            .btn-secondary {
                 padding: 0.75rem 1rem; border-radius: 0.375rem; font-weight: 600; color: #E0E0E0;
                background-color: #2d2d2d; transition: background-color 0.2s;
            }
            .btn-secondary:hover { background-color: #3d3d3d; }
          `}</style>
        </div>
    );
};