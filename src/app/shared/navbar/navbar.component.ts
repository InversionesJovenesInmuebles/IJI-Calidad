import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router, RouterLink} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    NgClass
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  role: string = 'Guest';
  menuOpen = false;  // Variable para controlar el estado del menú

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getRole().subscribe(role => {
      this.role = role;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/index']).then(() => {
      window.location.reload();
    });
  }

  // Función para alternar el estado del menú
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
