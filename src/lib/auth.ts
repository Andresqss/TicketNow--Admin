export const login = async (nombreUsuario: string, password: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_EXPRESS}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombreUsuario, password }),
  });

  if (!res.ok) throw new Error('Credenciales inválidas');
  return res.json();
};
