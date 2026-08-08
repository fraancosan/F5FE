import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { equipo, equipoTorneo, partidoTorneo, torneo } from '../../../../Interfases/interfaces';
import { Navigation } from '../../../../services/common/navigation';
import { Equipo } from '../../../../services/db/equipo';
import { EquipoTorneo } from '../../../../services/db/equipo-torneo';
import { PartidosTorneo } from '../../../../services/db/partidos-torneo';
import { Torneo } from '../../../../services/db/torneo';
import VerPartidos from './ver-partidos';

describe('VerPartidos', () => {
  let component: VerPartidos;
  let fixture: ComponentFixture<VerPartidos>;
  let torneosServiceSpy: jasmine.SpyObj<Torneo>;
  let partidosServiceSpy: jasmine.SpyObj<PartidosTorneo>;
  let equipoTorneoServiceSpy: jasmine.SpyObj<EquipoTorneo>;
  let equipoServiceSpy: jasmine.SpyObj<Equipo>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let navSpy: jasmine.SpyObj<Navigation>;

  const torneoMock: torneo = {
    id: 1,
    descripcion: 'Torneo de verano',
    fechaInicio: new Date('2026-08-01'),
    fechaFin: new Date('2026-08-15'),
    precioInscripcion: 15000,
    cantidadEquipos: 8,
  };

  const equipoUno: equipo = { id: 10, nombre: 'Equipo A' };
  const equipoDos: equipo = { id: 11, nombre: 'Equipo B' };

  const partidoMock: partidoTorneo = {
    id: 44,
    idEquipo1: equipoUno,
    idEquipo2: equipoDos,
    idTorneo: torneoMock,
    resultado: '2-1',
    fecha: new Date('2026-08-10'),
  };

  beforeEach(async () => {
    torneosServiceSpy = jasmine.createSpyObj<Torneo>('Torneo', ['getById']);
    partidosServiceSpy = jasmine.createSpyObj<PartidosTorneo>('PartidosTorneo', [
      'getAll',
      'create',
      'update',
      'delete',
    ]);
    equipoTorneoServiceSpy = jasmine.createSpyObj<EquipoTorneo>('EquipoTorneo', [
      'getAllById',
      'create',
    ]);
    equipoServiceSpy = jasmine.createSpyObj<Equipo>('Equipo', ['getAll', 'getById']);
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    navSpy = jasmine.createSpyObj<Navigation>('Navigation', ['toPageTop']);

    torneosServiceSpy.getById.and.returnValue(of(torneoMock));
    partidosServiceSpy.getAll.and.returnValue(of([partidoMock]));
    partidosServiceSpy.create.and.returnValue(of({}));
    partidosServiceSpy.update.and.returnValue(of({}));
    partidosServiceSpy.delete.and.returnValue(of({}));
    equipoTorneoServiceSpy.getAllById.and.returnValue(
      of([
        {
          id: 1,
          idEquipo: equipoUno,
          idTorneo: torneoMock.id,
          fechaCreacion: new Date('2026-07-20'),
          idMP: '',
          urlPreferenciaPago: '',
        } as equipoTorneo,
        {
          id: 2,
          idEquipo: equipoDos,
          idTorneo: torneoMock.id,
          fechaCreacion: new Date('2026-07-21'),
          idMP: '',
          urlPreferenciaPago: '',
        } as equipoTorneo,
      ])
    );
    equipoServiceSpy.getById.and.returnValue(of(equipoUno));

    await TestBed.configureTestingModule({
      imports: [VerPartidos],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' }),
            },
          },
        },
        { provide: Torneo, useValue: torneosServiceSpy },
        { provide: PartidosTorneo, useValue: partidosServiceSpy },
        { provide: EquipoTorneo, useValue: equipoTorneoServiceSpy },
        { provide: Equipo, useValue: equipoServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Navigation, useValue: navSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerPartidos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe cargar el torneo, sus partidos y sus equipos al iniciar', () => {
    expect(torneosServiceSpy.getById).toHaveBeenCalledWith(1);
    expect(partidosServiceSpy.getAll).toHaveBeenCalledWith({ idTorneo: 1 });
    expect(equipoTorneoServiceSpy.getAllById).toHaveBeenCalledWith({ idTorneo: 1 });
    expect(component.selectedTorneo).toEqual(torneoMock);
    expect(component.partidos).toEqual([partidoMock]);
    expect(component.equiposTorneo).toEqual([equipoUno, equipoDos]);
  });

  it('debe crear un partido con ids numéricos y torneo seleccionado', () => {
    component.nuevoPartido();
    component.partidoForm.setValue({
      idEquipo1: '10',
      idEquipo2: '11',
      resultado: '3-2',
      fecha: '2026-08-12',
    });

    component.guardarPartido();

    expect(partidosServiceSpy.create).toHaveBeenCalledWith({
      id: 0,
      idEquipo1: 10,
      idEquipo2: 11,
      idTorneo: torneoMock.id,
      resultado: '3-2',
      fecha: '2026-08-12' as unknown as Date,
    });
    expect(snackBarSpy.open).toHaveBeenCalledWith('Partido creado con éxito', 'Aceptar', {
      duration: 5000,
    });
  });

  it('debe cargar un partido en modo edición y actualizarlo', () => {
    component.editarPartido(partidoMock);
    expect(component.isEditPartido).toBeTrue();

    component.partidoForm.patchValue({
      resultado: '4-2',
      fecha: '2026-08-13',
    });

    component.guardarPartido();

    expect(partidosServiceSpy.update).toHaveBeenCalledWith(44, {
      id: 44,
      idEquipo1: 10,
      idEquipo2: 11,
      idTorneo: torneoMock.id,
      resultado: '4-2',
      fecha: '2026-08-13' as unknown as Date,
    });
    expect(snackBarSpy.open).toHaveBeenCalledWith('Partido actualizado con éxito', 'Aceptar', {
      duration: 5000,
    });
  });

  it('debe eliminar un partido cuando se confirma la acción', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.eliminarPartido(91);

    expect(partidosServiceSpy.delete).toHaveBeenCalledWith(91);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Partido eliminado con éxito', 'Aceptar', {
      duration: 5000,
    });
  });
});
