import Link from 'next/link';

export default function Footer() {
  const copyrightYear = 2025;
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@ejemplo.com';
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com';

  return (
    <footer className="w-full border-t bg-background py-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Columna Legal */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-semibold">Legal</h3>
            <Link 
              href="/legal/aviso-legal" 
              className="text-sm text-muted-foreground hover:underline"
            >
              Aviso Legal
            </Link>
            <Link 
              href="/legal/privacidad" 
              className="text-sm text-muted-foreground hover:underline"
            >
              Política de Privacidad
            </Link>
          </div>

          {/* Columna Social */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-semibold">Social</h3>
            <Link 
              href={linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:underline"
            >
              LinkedIn
            </Link>
            <Link 
              href={`mailto:${contactEmail}`}
              className="text-sm text-muted-foreground hover:underline"
            >
              Email
            </Link>
          </div>

          {/* Columna Copyright */}
          <div className="flex flex-col space-y-3 md:items-end md:justify-end">
            <p className="text-sm text-muted-foreground text-center md:text-right">
              © {copyrightYear} Francisco García.
              <br />
              Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
