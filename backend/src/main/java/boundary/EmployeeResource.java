package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Employee;
import repository.EmployeeRepository;

import java.util.List;

@Path("employee")
public class EmployeeResource {
    @Inject
    EmployeeRepository repository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createEmployee(Employee e){
        try {
            repository.create(e);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(){
        List<Employee> employees;
        try{
            employees = repository.getAll();
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(employees).build();
    }

    @GET
    @Path("{id: [0-9]+}")
    public Response getEmployee(@PathParam("id") Long id){
        Employee employee;
        try{
            employee = repository.getById(id);
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(employee).build();
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteEmployee(@PathParam("id") Long id){
        try{
            repository.delete(id);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Path("{id: [0-9]+}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateEmployee(@PathParam("id") Long id, Employee e){
        try{
            repository.update(e);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
