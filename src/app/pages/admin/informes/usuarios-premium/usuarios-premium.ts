import { Component } from '@angular/core';
import { GoBack } from '../../../../shared/go-back/go-back'; 
import { MatTableModule } from '@angular/material/table';
import { Spinner } from '../../../../shared/spinner/spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Button3 } from '../../../../shared/btns/button3/button3';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { usuarioPremium } from '../../../../Interfases/interfaces';
import { Users } from '../../../../services/db/users';

@Component({
  selector: 'app-usuarios-premium',
  imports: [
    GoBack,
    MatTableModule,
    Spinner,
    FormsModule,
    MatIconModule,
    MatButtonModule,  
    Button3,   
  ],
  templateUrl: './usuarios-premium.html',
  styleUrl: './usuarios-premium.css'
})
export default class UsuariosPremium {
  usuarios: usuarioPremium[] = [];
  totalParrilla: number = 0;
  displayedColumns: string[] = [
      'ID-USUARIO',
      'DNI',
      'NombreUsuario',
      'Email',
      'Telefono',
      'Nivel'
  ];

  loading: boolean = false;
  fechaHoy: string = new Date().toLocaleDateString();

  constructor(
    private snackBar: MatSnackBar,
    private usersService: Users) {}

  loadUsuariosPremium() {
  this.loading = true;
  this.usersService.getPremium().subscribe({
    next: (usuarios) => {
      this.usuarios = usuarios;
      this.loading = false;
    },
    error: (error) => {
      this.usuarios = [];
      this.snackBar.open('Error al cargar usuarios premium', 'Cerrar', { duration: 3000 });
      this.loading = false;
    }
  });
  }

  generarReporte() {
    this.loadUsuariosPremium();
  }
}
