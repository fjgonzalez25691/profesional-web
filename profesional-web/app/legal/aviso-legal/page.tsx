// FJG-57: Edge caching para páginas legales (contenido estático)
export const revalidate = 86400; // 24 horas

export default function AvisoLegalPage() {
  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Francisco Javier González Aparicio';
  const businessAddress = process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || 'Dirección Fiscal Pendiente';
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contacto@ejemplo.com';

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Aviso Legal</h1>
      
      <div className="space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">1. Datos Identificativos</h2>
          <p>
            En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, 
            de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, 
            se reflejan los siguientes datos:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li><strong>Titular:</strong> {businessName}</li>
            <li><strong>Domicilio:</strong> {businessAddress}</li>
            <li><strong>Email:</strong> {contactEmail}</li>
            <li><strong>Registro Mercantil / Actividad:</strong> Actividad profesional independiente (Freelance).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">2. Usuarios</h2>
          <p>
            El acceso y/o uso de este portal atribuye la condición de USUARIO, que acepta, 
            desde dicho acceso y/o uso, las Condiciones Generales de Uso aquí reflejadas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">3. Uso del Portal</h2>
          <p>
            El sitio web proporciona el acceso a multitud de informaciones, servicios, programas o datos 
            (en adelante, &quot;los contenidos&quot;) en Internet pertenecientes a {businessName}. 
            El USUARIO asume la responsabilidad del uso del portal.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">4. Propiedad Intelectual e Industrial</h2>
          <p>
            {businessName} es titular de todos los derechos de propiedad intelectual e industrial 
            de su página web, así como de los elementos contenidos en la misma.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">5. Exclusión de Garantías y Responsabilidad</h2>
          <p>
            {businessName} no se hace responsable, en ningún caso, de los daños y perjuicios 
            de cualquier naturaleza que pudieran ocasionar, a título enunciativo: errores u omisiones en los contenidos, 
            falta de disponibilidad del portal o la transmisión de virus o programas maliciosos o lesivos en los contenidos, 
            a pesar de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">6. Código de Conducta</h2>
          <p>
            El titular se compromete a observar la normativa vigente y los principios éticos aplicables a su actividad profesional.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-2">7. Resolución de Litigios</h2>
          <p>
             Conforme al Art. 14.1 del Reglamento (UE) 524/2013, la Comisión Europea facilita una plataforma de resolución de litigios en línea de libre acceso, disponible en el siguiente enlace: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">https://ec.europa.eu/consumers/odr/</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
