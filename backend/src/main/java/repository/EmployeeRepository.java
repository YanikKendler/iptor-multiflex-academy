package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Employee;

import java.util.List;

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

    public List<Employee> getAll() {
        return em.createQuery("select e from Employee e", Employee.class).getResultList();
    }

    public Employee getById(Long id){
        return em.find(Employee.class, id);
    }
}
