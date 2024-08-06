package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jdk.jfr.Unsigned;
import model.Customer;
import repository.CustomerRepository;

import java.util.List;

@Path("customer")
public class CustomerRessource {
    @Inject
    CustomerRepository repository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createCustomer(Customer c){
        try {
            repository.create(c);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(){
        List<Customer> customers;
        try{
            customers = repository.getAll();
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(customers).build();
    }

    @GET
    @Path("{id: [0-9]+}")
    public Response getCustomer(@PathParam("id") Long id){
        Customer customer;
        try{
            customer = repository.getById(id);
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(customer).build();
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteCustomer(@PathParam("id") Long id){
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
    public Response updateCustomer(@PathParam("id") Long id, Customer c){
        try{
            repository.update(c);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

}
