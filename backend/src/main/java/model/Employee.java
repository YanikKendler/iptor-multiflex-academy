package model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("EMPLOYEE")
public class Employee extends User {

    // keine Ahnung wie man das auf sich selbst verweisen richtig macht!!!!

    @ManyToOne
    private Employee supervisor;

    @ManyToOne
    private Employee deputySupervisor;

    private boolean isAdmin;

    public Employee(Long userId, String username, String email, Employee supervisor, Employee deputySupervisor, boolean isAdmin) {
        super(userId, username, email);
        this.supervisor = supervisor;
        this.deputySupervisor = deputySupervisor;
        this.isAdmin = isAdmin;
    }


    public Employee() {

    }

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
