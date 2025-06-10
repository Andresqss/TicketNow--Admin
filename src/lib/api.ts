const EXPRESS_API = process.env.NEXT_PUBLIC_API_EXPRESS!;
//const FASTAPI_API = process.env.NEXT_PUBLIC_API_FASTAPI!;

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${EXPRESS_API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Credenciales inválidas');
  return res.json();
};