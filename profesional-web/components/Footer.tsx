import Link from 'next/link';

export default function Footer() {
  const copyrightYear = 2025;
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@ejemplo.com';
  const linkedinUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com';
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com';
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Tu Nombre';

  return (
    <footer id="contact" className="w-full border-t bg-surface-900 py-8 md:py-10 mt-auto scroll-mt-24">
      <div className="container mx-auto px-6 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {/* Columna Contacto */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold text-text-primary">Contacto</h3>
            <Link
              href={`mailto:${contactEmail}`}
              className="text-base text-text-secondary hover:text-text-primary transition-colors hover:underline"
            >
              {contactEmail}
            </Link>
            {/* TODO: v0 - Texto "Agenda una reunión" provisional, puede ajustarse */}
            <Link
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-text-secondary hover:text-text-primary transition-colors hover:underline"
            >
              Agenda una reunión
            </Link>
          </div>

          {/* Columna Legal */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold text-text-primary">Legal</h3>
            <Link
              href="/legal/aviso-legal"
              className="text-base text-text-secondary hover:text-text-primary transition-colors hover:underline"
            >
              Aviso Legal
            </Link>
            <Link
              href="/legal/privacidad"
              className="text-base text-text-secondary hover:text-primary transition-colors hover:underline"
            >
              Política de Privacidad
            </Link>
          </div>

          {/* Columna Social/Enlaces */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold text-text-primary">Social</h3>
            <Link
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-text-secondary hover:text-text-primary transition-colors hover:underline"
            >
              LinkedIn
            </Link>
          </div>
        </div>

        {/* Copyright - Fila separada debajo */}
        <div className="mt-8 pt-6 border-t border-surface-800">
          <p className="text-sm text-text-secondary text-center">
            © {copyrightYear} {businessName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
