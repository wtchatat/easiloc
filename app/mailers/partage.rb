class Partage < ActionMailer::Base
  default from: "easiloc@easiloc.com"
  layout 'mailer'

  def partage_route(user,guest)
    @user = user
    @guest = guest
    mail(:from=> "#{guest.name}, un itineraire pour vous", :to => guest.email, :subject => "#{user.name.to_s.capitalize}, partage un itineraire avec toi")
  end

  def partage_location(user,guest)
    @user = user
    @guest = guest
    mail(:to => guest.email, :subject => "#{user.name.to_s.capitalize}, partage un itineraire avec toi")
  end
  def landing_invite(user,existed)
    @invite = user
    @existed = existed
    mail(:to => @invite.email, :subject => "easiloc , vip utilisateur")
  end


end
