package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Tag;
import repository.TagRepository;

import java.util.List;

@Path("tag")
public class TagResource {
    @Inject
    TagRepository repository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createDevice(Tag t){
        try {
            repository.create(t);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(){
        List<Tag> tags;
        try{
            tags = repository.getAll();
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(tags).build();
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteDevice(@PathParam("id") Long id){
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
    public Response updateDevice(@PathParam("id") Long id, Tag t){
        try{
            repository.update(t);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
