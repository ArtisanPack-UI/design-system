import { Accordion, AccordionItem, Card } from '@artisanpack-ui/react';

export default function VariantsExample() {
  return (
    <>
      <Accordion variant="separated" multiple defaultValue={['billing']}>
        <AccordionItem value="billing" title="Billing">
          Invoices go to the account owner on the first of each month.
        </AccordionItem>
        <AccordionItem value="seats" title="Seats">
          Add or remove seats at any time; changes are prorated.
        </AccordionItem>
      </Accordion>

      <Card>
        <Accordion variant="flush" headingLevel={4}>
          <AccordionItem value="details" title="Listing details">
            Three bedrooms, two bathrooms, 118 m².
          </AccordionItem>
        </Accordion>
      </Card>
    </>
  );
}
