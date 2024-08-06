package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Employee;

@ApplicationScoped
public class EmployeeRepository {

    @Inject
    EntityManager em;

    @Transactional
    public void create(Employee employee) {
        em.persist(employee);
    }

    @Transactional
    public void update(Employee employee) {
        em.merge(employee);
    }

    @Transactional
    public void delete(Long id) {
        em.remove(getById(id));
    }


    public Employee getById(Long id){
        return em.find(Employee.class, id);
    }
}
