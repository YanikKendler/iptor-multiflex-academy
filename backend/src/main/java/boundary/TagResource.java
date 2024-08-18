package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Tag;
import repository.TagRepository;

import java.util.List;

@Path("/video/{videoId: [0-9]+}/tag")
public class TagResource {
    @Inject
    TagRepository repository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createTag(@PathParam("videoId")Long vid, Tag t){
        try {
            repository.create(vid, t);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@PathParam("videoId")Long vid){
        List<Tag> tags;
        try{
            tags = repository.getAll(vid);
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(tags).build();
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteTag(@PathParam("id") Long id){
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
    public Response updateTag(@PathParam("id") Long id, Tag t){
        try{
            repository.update(t);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
