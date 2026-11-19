import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { API_URL } from '../../core/api.config';
import { CreditRequest } from '../../core/models/credit-request';
import { CreditRequestList } from './credit-request-list';

const url = `${API_URL}/credit-requests`;
const pending: CreditRequest = {
  id: 'a1', cedula: '8-123-456', amount: 1500, termMonths: 12, status: 'PENDING',
  statusComment: null, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
};
const approved: CreditRequest = { ...pending, id: 'b2', cedula: 'PE-1-234', status: 'APPROVED', statusComment: 'ok' };

describe('CreditRequestList', () => {
  let fixture: ComponentFixture<CreditRequestList>;
  let http: HttpTestingController;
  const el = () => fixture.nativeElement as HTMLElement;
  const buttons = (text: string) => [...el().querySelectorAll('button')].filter((b) => b.textContent?.trim().startsWith(text));

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CreditRequestList);
    fixture.detectChanges();
    http.expectOne(url).flush([pending, approved]);
    await fixture.whenStable();
  });

  it('muestra las solicitudes y los botones solo en las pendientes', () => {
    expect(el().querySelectorAll('tbody tr')).toHaveLength(2);
    expect(buttons('Aprobar')).toHaveLength(1);
    expect(buttons('Rechazar')).toHaveLength(1);
  });

  it('filtra por estado pidiéndolo a la API', async () => {
    buttons('Aprobadas')[0].click();
    const req = http.expectOne((r) => r.url === url && r.params.get('status') === 'APPROVED');
    req.flush([approved]);
    await fixture.whenStable();
    expect(el().querySelectorAll('tbody tr')).toHaveLength(1);
  });

  it('exige comentario antes de aprobar', async () => {
    buttons('Aprobar')[0].click();
    await fixture.whenStable();
    buttons('Confirmar')[0].click();
    await fixture.whenStable();
    http.expectNone(`${url}/a1/status`);
    expect(el().querySelector('.error')?.textContent).toContain('comentario es obligatorio');
  });

  it('envía PATCH con estado y comentario y recarga el listado', async () => {
    buttons('Rechazar')[0].click();
    await fixture.whenStable();
    const input = el().querySelector('tbody input') as HTMLInputElement;
    input.value = 'Ingresos insuficientes';
    input.dispatchEvent(new Event('input'));
    buttons('Confirmar')[0].click();
    const req = http.expectOne(`${url}/a1/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'REJECTED', comment: 'Ingresos insuficientes' });
    req.flush({ ...pending, status: 'REJECTED' });
    http.expectOne(url).flush([]);
  });

  it('muestra el mensaje de error de la API (409)', async () => {
    buttons('Aprobar')[0].click();
    await fixture.whenStable();
    const input = el().querySelector('tbody input') as HTMLInputElement;
    input.value = 'ok';
    input.dispatchEvent(new Event('input'));
    buttons('Confirmar')[0].click();
    http.expectOne(`${url}/a1/status`).flush(
      { message: 'No se puede cambiar una solicitud de APPROVED a REJECTED' },
      { status: 409, statusText: 'Conflict' },
    );
    await fixture.whenStable();
    expect(el().querySelector('.error')?.textContent).toContain('No se puede cambiar');
  });
});
