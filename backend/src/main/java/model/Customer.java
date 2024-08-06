package model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("CUSTOMER")
public class Customer extends User {

    @ManyToOne
    private Customer supervisor;

    @Column
    private String companyName;

    @Column
    private boolean isManager;


    public Customer(Long userId, String username, String email, Customer supervisor, String companyName, boolean isManager) {
        super(userId, username, email);
        this.supervisor = supervisor;
        this.companyName = companyName;
        this.isManager = isManager;
    }

    public Customer() {

    }

    //<editor-fold desc="Getter und Setter">
    public Customer getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(Customer supervisor) {
        this.supervisor = supervisor;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public boolean isManager() {
        return isManager;
    }

    public void setManager(boolean manager) {
        isManager = manager;
    }
    //</editor-fold>
}
