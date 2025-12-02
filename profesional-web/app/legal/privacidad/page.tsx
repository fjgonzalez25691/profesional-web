export default function PrivacidadPage() {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Francisco Javier González Aparicio';
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@ejemplo.com';
  const businessAddress = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || 'Dirección Fiscal Pendiente';

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Política de Privacidad</h1>
      
      <div className="space-y-6 text-muted-foreground">
        <p>
          {businessName} informa a los usuarios del sitio web sobre su política 
          respecto del tratamiento y protección de los datos de carácter personal de los usuarios y clientes 
          que puedan ser recabados por la navegación o contratación de servicios a través de su sitio web.
        </p>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">1. Responsable del Tratamiento</h2>
          <ul className="list-disc pl-6">
            <li><strong>Titular:</strong> {businessName}</li>
            <li><strong>Domicilio:</strong> {businessAddress}</li>
            <li><strong>Email:</strong> {contactEmail}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">2. Finalidad del Tratamiento</h2>
          <p>
            La finalidad del tratamiento de los datos personales que se puedan recoger son usarlos principalmente por el
            titular para la gestión de su relación con usted, poder ofrecerle productos y servicios de acuerdo con sus
            intereses, mejorar su experiencia de usuario y en su caso, para el tratamiento de sus solicitudes, peticiones
            o pedidos.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">3. Legitimación</h2>
          <p>
            La base legal para el tratamiento de sus datos es:
          </p>
          <ul className="list-disc pl-6 mt-2">
             <li>El consentimiento del interesado para la tramitación de sus solicitudes.</li>
             <li>La ejecución de un contrato o precontrato en caso de servicios profesionales.</li>
             <li>El interés legítimo del responsable para fines de seguridad y mejora del servicio.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">4. Conservación de datos</h2>
          <p>
             Los datos proporcionados se conservarán mientras se mantenga la relación comercial o durante los años necesarios para cumplir con las obligaciones legales.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">5. Destinatarios (Comunicación de datos)</h2>
          <p>
            Los datos no se cederán a terceros salvo en los casos en que exista una obligación legal o sea necesario para la prestación del servicio (ej. proveedores de hosting o pasarelas de pago), siempre bajo acuerdos de confidencialidad y encargo de tratamiento.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">6. Derechos del Usuario</h2>
          <p>
            El usuario tiene derecho a obtener confirmación sobre si se están tratando datos personales que le conciernan. Puede ejercer sus derechos de:
          </p>
          <ul className="list-disc pl-6 mt-2">
             <li><strong>Acceso:</strong> Consultar qué datos personales tenemos suyos.</li>
             <li><strong>Rectificación:</strong> Solicitar la modificación de datos inexactos.</li>
             <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos.</li>
             <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos.</li>
             <li><strong>Limitación:</strong> Solicitar la limitación del tratamiento.</li>
             <li><strong>Portabilidad:</strong> Recibir sus datos personales facilitados.</li>
          </ul>
          <p className="mt-2">
             Para ejercer sus derechos, puede enviar una comunicación escrita a la dirección de email: {contactEmail}, adjuntando fotocopia de su DNI u otro documento identificativo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">7. Cookies y Rastreadores</h2>
          <p>
            Este sitio web utiliza cookies propias y de terceros para garantizar la mejor experiencia de navegación. Puede consultar el detalle en nuestra Política de Cookies (si disponible) o configurar sus preferencias en su navegador.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">8. Reclamaciones</h2>
          <p>
             Si considera que sus derechos no se han atendido debidamente, tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">www.aepd.es</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
