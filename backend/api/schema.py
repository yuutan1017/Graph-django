import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth.models import User
import graphql_jwt
from graphene_django.filter import DjangoFilterConnectionField
from graphene import relay
from graphql_jwt.decorators import login_required
from graphql_relay import from_global_id
from .models import Profile


class UserNode(DjangoObjectType):
  class Meta:
    model = User
    filter_fields = {'username': ['exact', 'icontains'],}
    interfaces = (relay.Node,)


class ProfileNode(DjangoObjectType):
  class Meta: 
    model = Profile
    filter_fields = {'user_profile__username': ['icontains'],}
    interfaces = (relay.Node,)


class CreateUserMutation(relay.ClientIDMutation):
  class Input:
    username = graphene.String(required=True)
    password = graphene.String(required=True)
    email = graphene.String(required=True)

  user = graphene.Field(UserNode)

  def mutate_and_get_payload(root, info, **input):
    user = User(username=input.get('username'), email=inpug.get('email'))
    user.set_password(input.get('password'))
    user.save()

    return CreateUserMutation(user=user)

class ProfileCreateMutation(relay.ClientIDMutation):
  profile = graphene.Field(ProfileNode)

  @login_required
  def mutate_and_get_payload(root, info, **input):
    profile = Profile(user_profile_id=info.context.user.id)
    profile.save()

    return ProfileCreateMutation(profile=profile)


class ProfileUpdateMutation(relay.ClientIDMutation):
  class Input:
    id = graphene.ID(required=True)
    followings = graphene.List(graphene.ID)

  profile = graphene.Field(ProfileNode)

  @login_required
  def mutate_and_get_payload(root, info, **input):
    profile = Profile.objects.get(id=from_global_id(input.get('id'))[1])
    print(profile)

    if input.get('followings') is not None:
      followings_set = []
      for follower in input.get('followings'):
        followings_id = from_global_id(follower)[1]
        followings_object = User.objects.get(id=followings_id)
        followings_set.append(followings_object)
      
      profile.folllowings.set(followings_set)
    profile.seve()

    return ProfileUpdateMutation(profile=profile)


class Mutation(graphene.AbstractType):
  create_user = CreateUserMutation.Field()
  token_auth = graphql_jwt.ObtainJSONWebToken.Field()
  create_profile = ProfileCreateMutation.Field()
  update_profile = ProfileUpdateMutation.Field()


class Query(graphene.ObjectType):
  profile = graphene.Field(ProfileNode)
  all_users = DjangoFilterConnectionField(UserNode)
  all_profiles = DjangoFilterConnectionField(ProfileNode)

  @login_required
  def resolve_profile(self, info, **kwargs):
    return Profile.objects.get(user_profile=info.context.user.id)
  
  @login_required
  def resolve_all_users(self, info, **kwargs):
    return User.object.all()

  @login_required
  def resolve_app_profiles(self, info, **kwargs):
    return Profile.objects.all()
  



