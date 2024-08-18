package model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("EMPLOYEE")
public class Employee extends User {

    @ManyToOne
    private Employee supervisor;

    @ManyToOne
    private Employee deputySupervisor;

    private boolean isAdmin;

    public Employee(String username, String email, Employee supervisor, Employee deputySupervisor, boolean isAdmin) {
        super(username, email);
        this.supervisor = supervisor;
        this.deputySupervisor = deputySupervisor;
        this.isAdmin = isAdmin;
    }

    public Employee() { }

    //<editor-fold desc="Getter und Setter">
    public Employee getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(Employee supervisor) {
        this.supervisor = supervisor;
    }

    public Employee getDeputySupervisor() {
        return deputySupervisor;
    }

    public void setDeputySupervisor(Employee deputySupervisor) {
        this.deputySupervisor = deputySupervisor;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }
    //</editor-fold>
}
