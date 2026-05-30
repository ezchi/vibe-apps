let cached: string | null = null;

export async function loadLogoBase64(): Promise<string> {
  if (cached) return cached;

  const response = await fetch('/Pike.Silicon.Icon.png');
  const blob = await response.blob();

  const result = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  cached = result;
  return result;
}
